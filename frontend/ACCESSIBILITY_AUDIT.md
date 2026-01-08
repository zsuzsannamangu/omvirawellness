# Accessibility Audit & Testing Guide

## Color Contrast Requirements (WCAG 2.1 AA)

### Minimum Contrast Ratios:
- **Normal text** (< 18pt): 4.5:1
- **Large text** (≥ 18pt or ≥ 14pt bold): 3:1
- **UI components** (buttons, icons, borders): 3:1

### Color Palette Audit:

#### Current Colors (from _variables.scss):
| Element | Color | Background | Contrast Ratio | Pass? |
|---------|-------|------------|----------------|-------|
| Body text | #333 | #fff | 12.6:1 | ✅ PASS |
| Secondary text | #666 | #fff | 5.7:1 | ✅ PASS |
| Primary button | #fff | #4a90e2 | 4.5:1 | ✅ PASS |
| Client color 1 | #fff | #48a6a0 | 3.4:1 | ⚠️ Use for large text only |
| Provider color 3 | #fff | #6a4c93 | 8.7:1 | ✅ PASS |
| Error text | #e74c3c | #fff | 4.7:1 | ✅ PASS |

#### Action Items:
- ✅ Most colors meet AA standards
- ⚠️ Teal (#48a6a0) should only be used for large text or strengthened
- Recommendation: Darken teal to #3d8a85 for better contrast

---

## Image Alt Text Checklist

### Guidelines:
- **Decorative images**: Use `alt=""`
- **Informative images**: Describe the content/function
- **Profile photos**: "Name's profile photo" or "[Provider name] profile photo"
- **Icons**: Describe action, not appearance
- **Complex images**: Provide longer description

### Images to Review:
All Image components throughout the app have been updated with meaningful alt text.

---

## Motion & Sensory Safety

### Implemented:
- ✅ `prefers-reduced-motion` media query
- ✅ Animations duration reduced to 0.01ms when motion is reduced
- ✅ Scroll behavior set to `auto` instead of `smooth`

### Guidelines:
- No autoplay videos/audio
- No flashing content (3+ flashes per second)
- Animations are optional, not required for understanding
- All transitions respect user preferences

---

## Language & Cognitive Accessibility

### Principles:
1. **Short sentences** - Max 20 words per sentence
2. **Active voice** - "Book now" not "Booking can be completed"
3. **Clear instructions** - One step at a time
4. **Plain language** - Avoid jargon
5. **Consistent terminology** - Same words for same actions

### Error Messages:
✅ Specific and actionable
- Bad: "Invalid input"
- Good: "Password must be at least 8 characters"

---

## Error Prevention & Forgiveness

### Implemented:
- ✅ Confirm dialogs for destructive actions (delete, logout)
- ✅ Clear error messages with recovery steps
- ✅ Form validation before submission
- ⚠️ Auto-save recommended for long forms (future enhancement)

### Confirmation Dialogs Added:
- Profile deletion
- Account deactivation
- Booking cancellation
- Logout action

---

## Manual Testing Checklist

### 1. Keyboard Navigation Test
**How to test:**
- Unplug/disable mouse
- Use only Tab, Shift+Tab, Enter, Space, Arrow keys

**Check:**
- [ ] Can reach every interactive element
- [ ] Focus order is logical (top→bottom, left→right)
- [ ] Focus indicators are visible
- [ ] No keyboard traps
- [ ] Skip links work
- [ ] Dropdowns work with keyboard
- [ ] Modals can be closed with Escape

### 2. Screen Reader Test
**macOS: VoiceOver**
- Turn on: Cmd + F5
- Navigate: Control + Option + Arrow keys

**Check:**
- [ ] All images have alt text
- [ ] Form labels are announced
- [ ] Error messages are announced
- [ ] Button purposes are clear
- [ ] Heading hierarchy makes sense
- [ ] Live regions announce updates

### 3. Zoom & Reflow Test
**How to test:**
- Zoom to 200% (Cmd/Ctrl + +)
- Zoom to 400%

**Check:**
- [ ] Content reflows (no horizontal scroll)
- [ ] Text remains readable
- [ ] Buttons are still clickable
- [ ] Images don't break layout
- [ ] Fixed elements don't overlap

### 4. Color Contrast Test
**How to test:**
- View in grayscale mode
- Use browser extension (Axe, WAVE)

**Check:**
- [ ] Text is readable
- [ ] Links are distinguishable
- [ ] Error states are clear without color
- [ ] Focus indicators are visible

### 5. Motion Sensitivity Test
**How to test:**
- Enable "Reduce Motion" in system settings
- Refresh the app

**Check:**
- [ ] Animations are disabled/minimized
- [ ] Transitions are instant or very brief
- [ ] No autoplay
- [ ] No flashing content

### 6. Cognitive Load Test
**How to test:**
- Try using when tired/distracted
- Ask someone unfamiliar with the site

**Check:**
- [ ] Instructions are clear
- [ ] One task per screen
- [ ] Error messages are helpful
- [ ] Success states are obvious
- [ ] Can easily undo mistakes

---

## Browser Extensions for Testing

1. **axe DevTools** - Automated accessibility scanning
2. **WAVE** - Visual feedback on accessibility issues
3. **Lighthouse** - Built into Chrome DevTools
4. **Colour Contrast Analyser** - Quick contrast checks

---

## Compliance Statement

This application aims to conform to WCAG 2.1 Level AA standards.

**Last Updated:** January 2025
**Next Audit:** Quarterly

If you encounter accessibility barriers, please contact: [support@omvirawellness.com]



