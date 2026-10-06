export function generateIncidentId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `SS-EMG-${year}-${randomNum}`;
}

export function generateMissingCaseId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `SS-MELA-${year}-${randomNum}`;
}

export function generateDeliveryId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SS-DEL-${randomNum}`;
}
