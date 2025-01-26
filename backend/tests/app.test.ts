import { faker } from '@faker-js/faker';

describe('Faker example', () => {
    it('should generate a random name', () => {
        const name = faker.person.fullName();
        expect(typeof name).toBe('string');
    });
});

describe('Sample test', () => {
    it('should pass', () => {
        expect(1 + 1).toBe(2);
    });
});
