export function sanitizeInput(inputString: any): string {
    const clean1 = String(inputString)
    const clean2 = clean1.trim()
    const clean3 = clean2.replace(/[^a-z0-9 \?!.$',-]/gi,'')
    return clean3
}