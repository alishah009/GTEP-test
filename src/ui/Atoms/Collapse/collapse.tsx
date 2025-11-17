import { ExpandDown, ExpandIconDown, ExpandIconUp } from '@/ui/assets/icons/VMSIcon'
import { cn } from '@/ui/utils/cn'
import { Collapse } from 'antd'
import React, { ReactNode } from 'react'

interface CollapsibleItem {
  key: number
  label: string
  children: ReactNode
  extra?: ReactNode
}

interface CollapseMoleculeProps {
  data: CollapsibleItem[]
  extraClass?: string
  ghost?: boolean
}

const CollapseAtom: React.FC<CollapseMoleculeProps> = ({ data, extraClass, ghost }) => {
  return (
    <Collapse
      items={data}
      expandIconPosition={'end'}
      size='large'
      className={cn('VMS_CUSTOM_COLLAPSE', extraClass)}
      ghost={ghost}
      expandIcon={({ isActive }) =>
        !ghost ? <ExpandDown /> : isActive ? <ExpandIconUp /> : <ExpandIconDown />
      }
    />
  )
}

export default CollapseAtom
