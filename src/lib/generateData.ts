import { faker } from "@faker-js/faker";

export function generateFakeData(count = 100000) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    city: faker.location.city(),
    avatar: faker.image.avatar(),
    createdAt: faker.date.past(),
  }));
}