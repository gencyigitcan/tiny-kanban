export function encodingExists(_enc: string): boolean {
    return true;
}

export function decode(buf: any, _enc: string): string {
    if (typeof buf === 'string') return buf;
    return new TextDecoder('utf-8').decode(buf);
}

export function getDecoder(_enc: string): any {
    const decoder = new TextDecoder('utf-8');
    return {
        write: (buf: any) => {
            if (typeof buf === 'string') return buf;
            return decoder.decode(buf, { stream: true });
        },
        end: () => ''
    };
}
