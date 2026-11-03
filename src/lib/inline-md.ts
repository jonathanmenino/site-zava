// Converte o pouco de Markdown usado nos textos curtos (negrito e links) em HTML.
const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function inlineMd(text: string): string {
  return escape(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[(.+?)\]\((\/[^)\s]*|https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" class="font-medium text-orange underline underline-offset-4 hover:text-purple">$1</a>',
    );
}
