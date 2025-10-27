export function parseMulterError(code: string): { status: number; message: string } {
  switch (code) {
    case 'LIMIT_FILE_SIZE':
      return { status: 400, message: 'File size is too large.' };
    case 'LIMIT_FILE_COUNT':
      return { status: 400, message: 'File count limit exceeded.' };
    case 'LIMIT_UNEXPECTED_FILE':
      return { status: 400, message: 'Unexpected file field.' };
    default:
      return { status: 400, message: 'File error occurred.' };
  }
}