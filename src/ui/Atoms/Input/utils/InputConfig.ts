export interface InputConfig {
  showLabel?: boolean
  showLabelContainer?: boolean
  showError?: boolean
  showOptional?: boolean
}

export interface InputClassNames {
  label?: string
  wrapper?: string
}

export interface InputFieldClassNames extends InputClassNames {
  root?: string
}
