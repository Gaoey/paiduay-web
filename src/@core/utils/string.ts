export function trimMessage(message: string, maxLength: number): string {
  if (message.length <= maxLength) {
    return message
  } else {
    return message.substring(0, maxLength) + '...'
  }
}
