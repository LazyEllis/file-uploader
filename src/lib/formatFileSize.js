const ONE_KILOBYTE = 1024;
const ONE_MEGABYTE = 1024 * ONE_KILOBYTE;
const MEGABYTE_DECIMALS = 1;

const formatFileSize = (size) => {
  if (size < ONE_KILOBYTE) {
    return `${size} ${size === 1 ? "byte" : "bytes"}`;
  }

  if (size < ONE_MEGABYTE) {
    return `${Math.round(size / ONE_KILOBYTE)} KB`;
  }

  return `${(size / ONE_MEGABYTE).toFixed(MEGABYTE_DECIMALS)} MB`;
};

export default formatFileSize;
