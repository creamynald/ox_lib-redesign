import { MantineThemeOverride } from '@mantine/core';

const inputLabelStyles = {
  label: {
    fontFamily: '"Oswald", sans-serif',
    fontWeight: 500,
    fontSize: 13,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    lineHeight: 1.2,
    marginBottom: 4,
    color: 'var(--ox-primary-color)',
  },
  description: {
    fontFamily: '"Oswald", sans-serif',
    fontSize: 12,
    letterSpacing: '0.5px',
  },
  input: {
    fontFamily: '"Oswald", sans-serif',
    fontSize: 14,
    letterSpacing: '0.5px',
    backgroundColor: 'var(--ox-item-bg)',
    border: '1px solid rgba(255,255,255,0.1)',
    '&:focus': {
      borderColor: 'var(--ox-primary-color)',
    },
  },
};

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: '"Oswald", sans-serif',
  shadows: { sm: '1px 1px 3px rgba(0, 0, 0, 0.5)' },
  components: {
    Button: {
      styles: {
        root: {
          border: 'none',
          fontFamily: '"Oswald", sans-serif',
          fontWeight: 500,
          fontSize: 13,
          letterSpacing: '1px',
          textTransform: 'uppercase' as const,
        },
      },
    },
    TextInput: { styles: inputLabelStyles },
    PasswordInput: { styles: inputLabelStyles },
    NumberInput: { styles: inputLabelStyles },
    Textarea: { styles: inputLabelStyles },
    Select: { styles: inputLabelStyles },
    MultiSelect: { styles: inputLabelStyles },
    Slider: {
      styles: {
        label: {
          fontFamily: '"Oswald", sans-serif',
          fontSize: 12,
        },
      },
    },
  },
};
