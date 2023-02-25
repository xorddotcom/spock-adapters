export function topicToAddress(topic: string) {
  return `0x${topic.substring(26)}`;
}
