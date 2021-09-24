import endpoint from './endpoint';
export const sanitize = (code) => {
    const sanitized = `${code}`
        .replace(/[^0-9０-９]/g, '')
        .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
    return [sanitized.slice(0, 3), sanitized.slice(3, 7)];
};
export const makeRequestURL = ([first, second]) => `${endpoint.api}${first}/${second}.json`;
export const parseResponse = (res) => {
    const { data: [{ prefcode, ja: data }] } = res;
    return {
        prefectureCode: prefcode,
        prefecture: data.prefecture,
        address1: data.address1,
        address2: data.address2,
        address3: data.address3,
        address4: data.address4
    };
};
//# sourceMappingURL=utils.js.map