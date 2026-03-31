import { NextRequest, NextResponse } from "next/server";
import { generateFakeData } from "@/lib/generateData";

const allData = generateFakeData(1000000);

type ReqUserBody = {
    id?: string | number;
    name?: string;
    email?: string;
    city?: string;
    avatar?: string;
}
// normalize to lower, remove accents, whitespace -> single space, trim
function normalizeText(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

// separate string into tokens by common delimiters
function tokenize(value: string): string[] {
    return value.split(/[\s@._-]+/).filter(Boolean);
}

// check queryToken is a subsequence of valueToken, allowing missing chars but keeping order
function isSubsequenceMatch(queryToken: string, valueToken: string): boolean {
    let queryIndex = 0;

    for (let valueIndex = 0; valueIndex < valueToken.length; valueIndex++) {
        if (queryToken[queryIndex] === valueToken[valueIndex]) {
            queryIndex++;
        }

        if (queryIndex === queryToken.length) {
            return true;
        }
    }

    return false;
}
// check distance 
function isEditDistanceWithin(source: string, target: string, maxDistance: number): boolean {
    if (Math.abs(source.length - target.length) > maxDistance) {
        return false;
    }

    let previous: number[] = Array.from(
        { length: target.length + 1 },
        (_, idx) => idx
    );
    let current: number[] = new Array(target.length + 1).fill(0);

    for (let i = 1; i <= source.length; i++) {
        current[0] = i;
        let minRowValue = current[0];

        for (let j = 1; j <= target.length; j++) {
            const cost = source[i - 1] === target[j - 1] ? 0 : 1;
            current[j] = Math.min(
                previous[j] + 1,
                current[j - 1] + 1,
                previous[j - 1] + cost
            );

            if (current[j] < minRowValue) {
                minRowValue = current[j];
            }
        }

        if (minRowValue > maxDistance) {
            return false;
        }

        [previous, current] = [current, previous];
    }

    return previous[target.length] <= maxDistance;
}
function isFuzzyTokenMatch(queryToken: string, valueToken: string): boolean {
  if (valueToken.includes(queryToken) || queryToken.includes(valueToken)) {
    return true;
  }

  if (queryToken.length >= 3 && isSubsequenceMatch(queryToken, valueToken)) {
    return true;
  }

  const maxDistance = queryToken.length <= 4 ? 1 : 2;

  if (Math.abs(queryToken.length - valueToken.length) > maxDistance) {
    return false;
  }

  if (queryToken[0] !== valueToken[0]) {
    return false;
  }

  return isEditDistanceWithin(queryToken, valueToken, maxDistance);
}

function isFuzzyFieldMatch(query: string, queryTokens: string[], fieldValue: string): boolean {
  const normalizedField = normalizeText(fieldValue);

  if (!normalizedField) {
    return false;
  }

  if (normalizedField.includes(query)) {
    return true;
  }

  const fieldTokens = tokenize(normalizedField);

  return queryTokens.every((queryToken) =>
    fieldTokens.some((fieldToken) => isFuzzyTokenMatch(queryToken, fieldToken))
  );
}
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 20);
    const rawOrder = searchParams.get("order");
    const order = rawOrder === "desc" ? "desc" : "asc";

    const search = normalizeText(searchParams.get("search") || "");
    // Support both 'sort' (old) and 'orderby' (current client)
    const sort = searchParams.get("orderby") || searchParams.get("sort") || "id";

    const offsetParam = searchParams.get("offset");
    const pageParam = searchParams.get("page");
    const page = Number(pageParam) || 1;

    const offset = (() => {
        if (offsetParam === null) return Math.max(0, (page - 1) * limit);
        const parsed = Number(offsetParam);
        return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    })();

    const responsePage = offsetParam !== null ? Math.floor(offset / limit) + 1 : page;

    // Fast-path: default case (no search, sort by id). This avoids copying + sorting 1,000,000 records.
    if (!search && sort === "id") {
        const total = allData.length;
        const start = Math.max(0, Math.min(offset, total));
        const end = Math.max(start, Math.min(start + limit, total));

        const data =
            order === "desc"
                ? allData
                      .slice(Math.max(0, total - end), Math.max(0, total - start))
                      .reverse()
                : allData.slice(start, end);

        return NextResponse.json({
            page: responsePage,
            limit,
            total,
            data,
        });
    }

    let filtered: any[] = allData;
    if (search) {
        const queryTokens = tokenize(search);
        filtered = allData.filter((item) => {
            const name = item.name ?? "";
            const email = item.email ?? "";
            return (
                isFuzzyFieldMatch(search, queryTokens, name) ||
                isFuzzyFieldMatch(search, queryTokens, email)
            );
        });
    }

    // If we're sorting by id asc, the filtered array keeps the original order already.
    if (!(sort === "id" && order === "asc")) {
        if (filtered === allData) {
            filtered = [...allData];
        }

        filtered.sort((a, b) => {
            const aValue = a[sort as keyof ReqUserBody] ?? "";
            const bValue = b[sort as keyof ReqUserBody] ?? "";
            if (aValue < bValue) {
                return order === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return order === "asc" ? 1 : -1;
            }
            return 0;
        });
    }

    const start = Math.max(0, offset);
    const end = start + limit;
    const data = filtered.slice(start, end);

    return NextResponse.json({
        page: responsePage,
        limit,
        total: filtered.length,
        data,
    });
}

export async function POST(request: NextRequest) {
    try {
        const body: ReqUserBody = await request.json();
        
        // Tạo user mới với ID ngẫu nhiên hoặc dựa trên timestamp
        const newUser: any = {
            id: Date.now().toString(), // Hoặc dùng uuid
            name: body.name || "",
            email: body.email || "",
            city: body.city || "",
            avatar: body.avatar || "",
            ...body
        };

        // Thêm vào đầu mảng để dễ thấy khi fetch dữ liệu (hoặc dùng .push() để thêm vào cuối)
        allData.unshift(newUser); 

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

// --- CẬP NHẬT (UPDATE) ---
export async function PUT(request: NextRequest) {
    try {
        const body: ReqUserBody = await request.json();
        const { id, ...updateFields } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
        }

        // Tìm index của user cần sửa
        const index = allData.findIndex((user: any) => String(user.id) === String(id));
        
        if (index === -1) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Cập nhật dữ liệu vào mảng gốc
        allData[index] = { ...allData[index], ...updateFields };

        return NextResponse.json(allData[index]);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

// --- XÓA (DELETE) ---
export async function DELETE(request: NextRequest) {
    try {
        // Lấy ID từ URL (VD: /api/users?id=123)
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        // Nếu client gửi ID qua body thay vì URL params thì dùng cách này:
        // const body = await request.json();
        // const id = body.id;

        if (!id) {
            return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
        }

        const index = allData.findIndex((user: any) => String(user.id) === String(id));
        
        if (index === -1) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Xóa phần tử khỏi mảng
        allData.splice(index, 1);

        return NextResponse.json({ message: "User deleted successfully", id });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}