import pdfplumber
import re

def extract_words_from_pdf(pdf_path):
    words = []
    
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue
            
            # 直接处理整个页面文本，按数字. 分割
            # 匹配格式：数字. 英文单词 词性. 中文翻译
            # 使用正则表达式全局匹配
            matches = re.findall(r'\d+\.\s*([a-zA-Z]+(?:\s+[a-zA-Z]+)*)\s+[a-zA-Z./]+\.\s+([\u4e00-\u9fa5；，、。]+)', text)
            
            for match in matches:
                english = match[0].strip()
                chinese = match[1].strip()
                # 清理中文翻译中的多余标点
                chinese = re.sub(r'\s+', '', chinese)
                if english and chinese:
                    words.append({'english': english, 'chinese': chinese})
    
    return words

def main():
    pdf_path = '四六级考前逆袭佛脚系列之700个救命高频词汇.pdf.pdf'
    words = extract_words_from_pdf(pdf_path)
    
    # 保存为JSON格式
    import json
    with open('words.json', 'w', encoding='utf-8') as f:
        json.dump(words, f, ensure_ascii=False, indent=2)
    
    print(f'提取了 {len(words)} 个单词')

if __name__ == '__main__':
    main()