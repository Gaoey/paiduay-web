import htmlTruncate from 'html-truncate'

export default function trimHtml(html: string, length: number, ending = '...') {
  return htmlTruncate(html, length, { ellipsis: ending })
}
