import clsx from 'clsx'

export function cn(...args) {
  return clsx(...args)
}

export function fmt(n, digits = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return Number(n).toFixed(digits)
}

export function percent(n, digits = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return `${(Number(n) * 100).toFixed(digits)}%`
}
