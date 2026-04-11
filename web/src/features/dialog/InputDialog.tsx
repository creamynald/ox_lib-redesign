import { Button, Group, Modal, Stack } from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';
import dayjs from 'dayjs';

export type FormValues = {
  test: {
    value: any;
  }[];
};

const InputDialog: React.FC = () => {
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();

  const form = useForm<{ test: { value: any }[] }>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
    setFields(data);
    setVisible(true);
    data.rows.forEach((row, index) => {
      fieldForm.insert(
        index,
        {
          value:
            row.type !== 'checkbox'
              ? row.type === 'date' || row.type === 'date-range' || row.type === 'time'
                ? // Set date to current one if default is set to true
                  row.default === true
                  ? new Date().getTime()
                  : Array.isArray(row.default)
                  ? row.default.map((date) => new Date(date).getTime())
                  : row.default && new Date(row.default).getTime()
                : row.default
              : row.checked,
        }
      );
      // Backwards compat with new Select data type
      if (row.type === 'select' || row.type === 'multi-select') {
        row.options = row.options.map((option) =>
          !option.label ? { ...option, label: option.value } : option
        ) as Array<OptionValue>;
      }
    });
  });

  useNuiEvent('closeInputDialog', async () => await handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    if (dontPost) return;
    fetchNui('inputData');
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);
    const values: any[] = [];
    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];

      if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
        if (!data.test[i]) continue;
        data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
      }
    }
    Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    fetchNui('inputData', values);
  });

  return (
    <>
      <Modal
        opened={visible}
        onClose={handleClose}
        closeOnEscape={fields.options?.allowCancel !== false}
        closeOnClickOutside={false}
        size={fields.options?.size || 'xs'}
        styles={{
          root: {
            pointerEvents: 'none',
          },
          inner: {
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            paddingTop: '15%',
            paddingRight: '25%',
            paddingLeft: 0,
            paddingBottom: 0,
            background: 'transparent',
            pointerEvents: 'none',
          },
          overlay: {
            display: 'none',
          },
          title: {
            textAlign: 'center',
            width: '100%',
            fontFamily: '"Oswald", sans-serif',
            fontWeight: 600,
            fontSize: 16,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            lineHeight: 1.2,
            color: '#ffffff',
          },
          modal: {
            width: 360,
            transform: 'rotate(-1.2deg)',
            transformOrigin: 'top right',
            fontFamily: '"Oswald", sans-serif',
            backgroundColor: 'var(--ox-bg-color)',
            borderRadius: 2,
            padding: 0,
            pointerEvents: 'all',
          },
          header: {
            backgroundColor: 'var(--ox-primary-color)',
            padding: '10px 14px',
            borderRadius: '2px 2px 0 0',
          },
          body: {
            backgroundColor: 'transparent',
            padding: '14px',
          },
        }}
        title={fields.heading}
        withCloseButton={false}
        overlayOpacity={0}
        transition="fade"
        exitTransitionDuration={150}
      >
        <form onSubmit={onSubmit}>
          <Stack>
            {fieldForm.fields.map((item, index) => {
              const row = fields.rows[index];
              return (
                <React.Fragment key={item.id}>
                  {row.type === 'input' && (
                    <InputField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {row.type === 'checkbox' && (
                    <CheckboxField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {(row.type === 'select' || row.type === 'multi-select') && (
                    <SelectField row={row} index={index} control={form.control} />
                  )}
                  {row.type === 'number' && <NumberField control={form.control} row={row} index={index} />}
                  {row.type === 'slider' && <SliderField control={form.control} row={row} index={index} />}
                  {row.type === 'color' && <ColorField control={form.control} row={row} index={index} />}
                  {row.type === 'time' && <TimeField control={form.control} row={row} index={index} />}
                  {row.type === 'date' || row.type === 'date-range' ? (
                    <DateField control={form.control} row={row} index={index} />
                  ) : null}
                  {row.type === 'textarea' && (
                    <TextareaField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                </React.Fragment>
              );
            })}
            <Group position="right" spacing={8} mt={4}>
              <Button
                uppercase
                variant="default"
                onClick={() => handleClose()}
                disabled={fields.options?.allowCancel === false}
                styles={{
                  root: {
                    backgroundColor: 'var(--ox-item-bg)',
                    fontFamily: '"Oswald", sans-serif',
                    fontSize: 13,
                    letterSpacing: '1px',
                    fontWeight: 500,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                  },
                }}
              >
                {locale.ui.cancel}
              </Button>
              <Button
                uppercase
                type="submit"
                styles={{
                  root: {
                    backgroundColor: 'var(--ox-primary-color)',
                    fontFamily: '"Oswald", sans-serif',
                    fontSize: 13,
                    letterSpacing: '1px',
                    fontWeight: 500,
                    color: '#fff',
                    '&:hover': { backgroundColor: 'var(--ox-primary-color-alpha)' },
                  },
                }}
              >
                {locale.ui.confirm}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default InputDialog;
