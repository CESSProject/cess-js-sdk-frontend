// The name must be unique in the current account.
// Its length must be between 3 ~ 63 characters.
// Can only consist of lowercase letters, numbers, dots (.), and hyphens (-).
// Must start and end with a letter or number.
// Must not contain two adjacent periods.
// Must not be formatted as an IP address.
export function isBucketName(name) {
  if (name.length < 3 || name.length > 63) {
    return "The name length must be between 3 ~ 63 characters.";
  }
  var pattern = /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/;
  if (!pattern.test(name)) {
    return "Can only consist of lowercase letters, numbers, dots (.), and hyphens (-).";
  }
  if (
    name.includes("..") ||
    name.includes("-.") ||
    name.includes(".-") ||
    name.includes("--")
  ) {
    return "Can only consist of lowercase letters, numbers, dots (.), and hyphens (-).";
  }
  var ipPattern = /^\d{1,3}(\.\d{1,3}){3}$/;
  if (ipPattern.test(name)) {
    return "Must not be formatted as an IP address.";
  }
  return null;
}
