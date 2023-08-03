export function replacePersianNumbers(text: string) {
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for (let i = 0; i < persianNumbers.length; i++) {
        text = text.replace(persianNumbers[i], englishNumbers[i]);
    }

    return text;
}