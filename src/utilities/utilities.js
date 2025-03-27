export default function generateIID() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
