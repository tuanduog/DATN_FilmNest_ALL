/**
 * Bộ lọc từ ngữ không phù hợp (Profanity Filter)
 * Hỗ trợ tiếng Việt và tiếng Anh
 */

const BANNED_WORDS = [
    // Tiếng Việt - từ tục, chửi thề
    "đụ", "địt", "đéo", "đĩ", "đù", "đồ chó", "đồ khốn",
    "dmm", "dm", "dcm", "đcm", "vcl", "vl", "vkl", "vcc",
    "clgt", "cặc", "buồi", "lồn", "cc", "cl",
    "mẹ mày", "má mày", "bố mày",
    "ngu", "đần", "khốn nạn", "chó", "con chó",
    "thằng ngu", "con ngu", "đồ ngu",
    "mắt lồi", "óc chó",
    "wtf", "wth",
    "dkm", "đkm",
    "cmm", "cmnr",
    "shit", "cứt",
    "xàm", "xạo",
    "thằng khốn", "đồ khốn",
    "chết mẹ", "chết cha",
    "mẹ kiếp", "tiên sư",
    "đ.m", "đ.ê.o",
    "nứng", "dâm",
    "con đĩ", "đồ đĩ",

    // English
    "fuck", "shit", "bitch", "asshole", "dick",
    "bastard", "damn", "crap", "idiot", "stupid",
    "moron", "retard", "slut", "whore",
    "stfu", "gtfo", "lmao",
    "nigga", "nigger",
    "pussy", "cock", "penis",
];

// Biến thể: thay ký tự đặc biệt -> chữ thường
const normalizeText = (text) => {
    return text
        .toLowerCase()
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
        .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
        .replace(/[ìíịỉĩ]/g, 'i')
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
        .replace(/[ùúụủũưừứựửữ]/g, 'u')
        .replace(/[ỳýỵỷỹ]/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/[0@]/g, 'o')
        .replace(/[1!]/g, 'i')
        .replace(/3/g, 'e')
        .replace(/\$/g, 's')
        .replace(/[*_.~\-]/g, '') // strip filler characters
        .trim();
};

/**
 * Kiểm tra xem text có chứa từ cấm không
 * @param {string} text
 * @returns {boolean}
 */
export const containsProfanity = (text) => {
    if (!text) return false;
    const normalized = normalizeText(text);
    return BANNED_WORDS.some(word => {
        const normalizedWord = normalizeText(word);
        // Word boundary check for short words to avoid false positives
        if (normalizedWord.length <= 2) {
            const regex = new RegExp(`(^|\\s|[^a-z])${escapeRegex(normalizedWord)}($|\\s|[^a-z])`, 'i');
            return regex.test(normalized);
        }
        return normalized.includes(normalizedWord);
    });
};

/**
 * Thay thế từ cấm bằng dấu ***
 * @param {string} text
 * @returns {string}
 */
export const filterProfanity = (text) => {
    if (!text) return text;
    let result = text;

    // Cách 1: Replace theo cụm từ chính xác (case-insensitive)
    const sorted = [...BANNED_WORDS].sort((a, b) => b.length - a.length);
    sorted.forEach(word => {
        const escaped = escapeRegex(word);
        const regex = new RegExp(escaped, 'gi');
        result = result.replace(regex, (match) => {
            if (match.length <= 1) return '*';
            return match[0] + '*'.repeat(match.length - 1);
        });
    });

    // Cách 2: Split theo từng từ và kiểm tra normalizeText để bắt các từ viết không dấu
    let words = result.split(/(\s+)/); // split giữ lại khoảng trắng
    result = words.map(word => {
        if (word.trim() === "") return word;
        
        let normalizedWord = normalizeText(word);
        let isBad = BANNED_WORDS.some(bw => {
            let nbw = normalizeText(bw);
            // So sánh chính xác cho từ ngắn
            if (nbw.length <= 2) {
                return normalizedWord === nbw;
            }
            return normalizedWord === nbw || normalizedWord.includes(nbw);
        });
        
        if (isBad) {
            return word[0] + '*'.repeat(word.length - 1);
        }
        return word;
    }).join("");

    return result;
};

// Helper to escape regex special chars
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export default { containsProfanity, filterProfanity };
