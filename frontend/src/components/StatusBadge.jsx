import React from 'react'

export default function StatusBadge({ status, size = 'md' }) {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      label: 'Pending',
    },
    confirmed: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
      label: 'Confirmed',
    },
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      label: 'Approved',
    },
    completed: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      label: 'Completed',
    },
    cancelled: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      label: 'Cancelled',
    },
    active: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      label: 'Active',
    },
    inactive: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      label: 'Inactive',
    },
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  const config = statusConfig[status?.toLowerCase()] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    label: status || 'Unknown',
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  )
}

