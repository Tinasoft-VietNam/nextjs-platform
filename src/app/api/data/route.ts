import { NextRequest, NextResponse } from "next/server";
import { generateFakeData } from "@/lib/generateData";

const allData = generateFakeData(100);

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
    const id = searchParams.get("id")?.trim() || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const search = normalizeText(searchParams.get("search") || "");
    const sort = searchParams.get("sort") || "id";
    const order = searchParams.get("order") || "asc";

    let filtered = [...allData];
    if(search) {
        const queryTokens = tokenize(search);
        filtered = filtered.filter((item) => {
            const name = item.name ?? "";
            const email = item.email ?? "";
            return (
                isFuzzyFieldMatch(search, queryTokens, name) ||
                isFuzzyFieldMatch(search, queryTokens, email)
            );
        });
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
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);
    return NextResponse.json({
        page,
        limit,
        total: filtered.length,
        data,
    });
}