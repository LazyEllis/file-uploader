import { test, expect } from "vitest";
import formatFileSize from "./formatFileSize";

const ONE_KILOBYTE = 1024;
const ONE_MEGABYTE = 1024 * 1024;

test("should format non-empty byte values as '<n> bytes'", () => {
  expect(formatFileSize(250)).toBe("250 bytes");
});

test("should format zero as '0 bytes'", () => {
  expect(formatFileSize(0)).toBe("0 bytes");
});

test("should use singular unit 'byte' for value 1", () => {
  expect(formatFileSize(1)).toBe("1 byte");
});

test("should format whole kilobyte values as '<n> KB'", () => {
  expect(formatFileSize(ONE_KILOBYTE)).toBe("1 KB");
  expect(formatFileSize(75 * ONE_KILOBYTE)).toBe("75 KB");
});

test("should round kilobyte values to nearest whole number", () => {
  expect(formatFileSize(ONE_KILOBYTE * 250.3)).toBe("250 KB");
  expect(formatFileSize(499.75 * ONE_KILOBYTE)).toBe("500 KB");
});

test("should format megabyte values with one decimal place", () => {
  expect(formatFileSize(ONE_MEGABYTE)).toBe("1.0 MB");
  expect(formatFileSize(10.19 * ONE_MEGABYTE)).toBe("10.2 MB");
});
