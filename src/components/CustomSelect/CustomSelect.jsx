import Select from "react-dropdown-select";
import styled from '@emotion/styled';
// https://www.npmjs.com/package/react-dropdown-select

export default function CustomSelect({
    options,
    values,
    searchable=false,
    dropdownPosition,
    disabled,
    onChange
}) {
    const StyledSelect = styled(Select)`
        min-height: var(--button-height); /* Минимальный размер равен высоте кнопки */
        padding: var(--button-padding);
        background-color: var(--bg-secondary);
        border: 1px solid var(--border-input);
        color: var(--text-white);
        font-size: var(--p);
        transition: 0s all;
        white-space: pre-wrap;

        /* Когда развернут */
        &[aria-expanded=true] {
            border: 1px solid var(--border-input-focus);
        }

        .react-dropdown-select-clear,
        .react-dropdown-select-dropdown-handle {
            color: var(--text-white);
            font-size: var(--p);
        }

        .react-dropdown-select-option {
            border: 1px solid var(--border-input);
        }

        .react-dropdown-select-item {
            color: var(--text-white);
            font-size: var(--p);
        }

        .react-dropdown-select-input {
            color: var(--text-white);
            font-size: var(--p);
        }
        
        .react-dropdown-select-dropdown {
            padding: 0;
            box-shadow: none;
            overflow: auto;
            
            color: var(--text-white);
            background-color: var(--select-item-bg);
            border: 1px solid var(--border-input);
            border-radius: var(--border-radius);

            z-index: var(--z-over);
        }

        .react-dropdown-select-item {
            min-height: var(--button-height); /* Минимальный размер равен высоте кнопки */
            padding: var(--button-padding);
            display: flex;
            align-items: center;
            color: var(--text-white);
            border: none;

            &:not(:last-of-type) {
                border-bottom: 1px solid var(--border-input);
            }
            
            &:hover {
                color: var(--text-white);
                background-color: var(--select-item-hover);
            }
        }

        .react-dropdown-select-item.react-dropdown-select-item-selected,
        .react-dropdown-select-item.react-dropdown-select-item-active {
            background-color: var(--button-bg-clicked);
            border-bottom: none;
        }

        .react-dropdown-select-item.react-dropdown-select-item-disabled {
            background-color: var(--button-bg-disabled);
            color: var(--text-dark);
        }
    `

    return <StyledSelect
        options={options}
        values={[values]} // Значение по умолчанию
        searchable={searchable}
        dropdownGap={4}
        color="var(--border-input)"
        dropdownPosition={dropdownPosition}
        disabled={disabled}
        onChange={onChange}
    />
}



