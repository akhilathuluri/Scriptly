# Word Cloud Feature Guide

## Overview
The Word Cloud feature provides visual analysis of word frequency in your documents, helping you understand your writing patterns and vocabulary usage.

---

## How to Access

Click the **Cloud icon** (☁️) in the top header (next to word count) to open the Word Cloud dialog.

---

## Features

### 1. **Word Cloud Visualization** ☁️
Interactive visual representation of word frequencies:
- **Larger words** = Used more frequently
- **Smaller words** = Used less frequently
- **Color intensity** = Frequency indicator
- **Hover** = See exact count and percentage

### 2. **Top Words Chart** 📊
Bar chart showing the 20 most frequently used words:
- Ranked by frequency
- Shows count and percentage
- Visual progress bars
- Export capability

### 3. **Document Statistics** 📈
Comprehensive writing analytics:
- **Total Words** - Overall word count
- **Unique Words** - Number of different words
- **Average Word Length** - Mean character count
- **Vocabulary Richness** - Diversity metric (30-60% is typical)
- **Longest Word** - The longest word in your document
- **Most Frequent Word** - Your most-used word

---

## Display Options

### Max Words
**Range**: 10-100 words
**Default**: 50 words
**Purpose**: Control how many words appear in the cloud

### Min Word Length
**Range**: 1-10 characters
**Default**: 3 characters
**Purpose**: Filter out very short words

### Exclude Common Words
**Default**: Enabled
**Purpose**: Removes common English words (the, and, is, etc.)
**Excluded words**: ~100 common stop words

### Case Sensitive
**Default**: Disabled
**Purpose**: Treat "Word" and "word" as different words

---

## Use Cases

### 1. **Content Analysis**
- Identify main themes in your writing
- Check for word repetition
- Ensure topic consistency

### 2. **SEO Optimization**
- Find keyword density
- Identify primary topics
- Check content focus

### 3. **Writing Improvement**
- Spot overused words
- Improve vocabulary diversity
- Enhance writing variety

### 4. **Academic Writing**
- Analyze terminology usage
- Check technical vocabulary
- Ensure appropriate language level

### 5. **Creative Writing**
- Identify recurring themes
- Check character name frequency
- Analyze writing style

---

## Understanding the Metrics

### Vocabulary Richness
**Formula**: Unique Words ÷ Total Words

**Interpretation**:
- **< 30%**: Limited vocabulary, high repetition
- **30-40%**: Average vocabulary diversity
- **40-50%**: Good vocabulary variety
- **50-60%**: Excellent vocabulary richness
- **> 60%**: Very diverse vocabulary (rare)

**Example**:
- 1000 total words
- 400 unique words
- Richness = 40% (Good!)

### Word Frequency Percentage
Shows what portion of your document each word represents.

**Example**:
- Word "data" appears 50 times
- Total words: 1000
- Percentage: 5%

---

## Tips & Best Practices

### 1. **Analyzing Your Writing**
- Look for unexpected high-frequency words
- Check if main topics are well-represented
- Identify words you might be overusing

### 2. **Improving Vocabulary**
- Low richness? Try using more varied words
- High frequency of one word? Find synonyms
- Use thesaurus for alternatives

### 3. **Content Optimization**
- Ensure keywords appear frequently enough
- Balance between repetition and variety
- Check if important terms are prominent

### 4. **Filtering Tips**
- **Enable "Exclude Common Words"** for meaningful analysis
- **Increase min word length** to focus on substantial words
- **Adjust max words** based on document size

### 5. **Comparing Documents**
- Export word clouds from different documents
- Compare vocabulary richness scores
- Track writing style evolution

---

## Examples

### Blog Post Analysis
```
Top Words:
1. marketing (45 times) - 4.5%
2. content (38 times) - 3.8%
3. strategy (32 times) - 3.2%
4. business (28 times) - 2.8%
5. digital (25 times) - 2.5%

Vocabulary Richness: 42%
✅ Good diversity with clear focus on marketing
```

### Technical Documentation
```
Top Words:
1. function (67 times) - 5.2%
2. parameter (54 times) - 4.2%
3. return (48 times) - 3.7%
4. value (45 times) - 3.5%
5. method (42 times) - 3.3%

Vocabulary Richness: 38%
✅ Appropriate technical terminology
```

### Creative Writing
```
Top Words:
1. said (89 times) - 6.1%
2. looked (45 times) - 3.1%
3. walked (38 times) - 2.6%
4. thought (35 times) - 2.4%
5. felt (32 times) - 2.2%

Vocabulary Richness: 52%
⚠️ Consider varying dialogue tags
✅ Excellent vocabulary diversity
```

---

## Export Options

### Export as Text
Downloads a `.txt` file containing:
- Complete word frequency list
- Word counts and percentages
- Ranked by frequency
- Easy to share or archive

**Use for**:
- Keeping records
- Sharing with team
- Further analysis in spreadsheets
- Documentation

---

## Common Questions

### Q: Why are some words missing?
**A**: Check your filters:
- Min word length might be too high
- Common words might be excluded
- Max words limit might be too low

### Q: What's a good vocabulary richness score?
**A**: 
- **30-40%**: Average (most documents)
- **40-50%**: Good (varied vocabulary)
- **50%+**: Excellent (very diverse)

### Q: Should I exclude common words?
**A**: 
- **Yes** for content analysis (see meaningful words)
- **No** for complete word count (include everything)

### Q: How often should I check my word cloud?
**A**: 
- **During writing**: Check for overused words
- **Before publishing**: Final vocabulary check
- **After editing**: Verify improvements

### Q: Can I use this for SEO?
**A**: Yes! 
- Check keyword density
- Ensure topic relevance
- Verify content focus
- Identify related terms

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Word Cloud | Click ☁️ icon |
| Switch to Chart | Click "Top Words" tab |
| Switch to Stats | Click "Statistics" tab |
| Export Data | Click "Export as Text" |
| Close Dialog | ESC or click outside |

---

## Technical Details

### What Gets Analyzed
✅ **Included**:
- Regular text
- Headings
- List items
- Blockquotes

❌ **Excluded**:
- Code blocks
- Inline code
- URLs
- Email addresses
- Numbers
- Markdown syntax

### Processing
1. Clean markdown syntax
2. Remove code and links
3. Normalize whitespace
4. Split into words
5. Count frequencies
6. Calculate percentages
7. Generate visualization

### Performance
- **Fast**: Processes 10,000 words in <100ms
- **Efficient**: Uses memoization for instant updates
- **Responsive**: Updates as you type (with debouncing)

---

## Troubleshooting

### No Words Showing
**Causes**:
- Document is empty
- All words filtered out
- Min word length too high

**Solutions**:
- Add content to document
- Lower min word length
- Disable "Exclude Common Words"

### Unexpected Results
**Causes**:
- Markdown syntax counted as words
- Code blocks included
- Case sensitivity issues

**Solutions**:
- Check filter settings
- Verify markdown is properly formatted
- Toggle case sensitivity

### Performance Issues
**Causes**:
- Very large document (>50,000 words)
- Too many unique words

**Solutions**:
- Reduce max words displayed
- Increase min word length
- Split document into sections

---

## Best Practices Summary

✅ **Do**:
- Use for content analysis
- Check vocabulary diversity
- Identify overused words
- Export for records
- Adjust filters as needed

❌ **Don't**:
- Rely solely on word count
- Ignore context and meaning
- Over-optimize for keywords
- Forget about readability
- Neglect content quality

---

## Resources

- **Word Frequency Analysis**: Understanding text patterns
- **Vocabulary Richness**: Measuring language diversity
- **SEO Keywords**: Optimizing content for search
- **Writing Style**: Improving your craft

---

**Analyze your writing and improve your content! ☁️**
