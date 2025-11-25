import { Role } from '@/enum/User'
import { ComponentType } from 'react'
import {
  HomeOutlined,
  TrophyOutlined,
  RiseOutlined,
  TeamOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons'

export type NavItem = {
  label: string
  href: string
  icon?: ComponentType
  roles?: Role[]
  children?: NavItem[]
}

export type RouteRule = {
  pattern: RegExp
  allowedRoles: Role[]
}
// If planning to add NavItems authorization please add them in ROUTE_RULES too
// Omit `roles` to allow everyone to see the item instead of listing every role.
// If you want any route to visible to all roles, omit the `roles` property.
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: HomeOutlined
  },
  {
    label: 'Achievements',
    href: '/achievements',
    icon: TrophyOutlined
  },
  {
    label: 'Training Courses',
    href: '/training_courses',
    icon: RiseOutlined
  },
  //   {
  //     label: 'Projects',
  //     href: '/projects',
  //     icon: FolderOutlined,
  //     roles: [Role.MANAGER, Role.ADMIN, Role.CUSTOMER],
  //     children: [
  //       {
  //         label: 'Overview',
  //         href: '/projects',
  //         icon: AppstoreOutlined,
  //         roles: [Role.MANAGER, Role.ADMIN]
  //       },
  //       {
  //         label: 'Team',
  //         href: '/projects/team',
  //         icon: TeamOutlined,
  //         roles: [Role.MANAGER, Role.CUSTOMER]
  //       }
  //     ]
  //   },
  {
    label: 'Leader Board',
    href: '/leader_board',
    icon: TeamOutlined
  },
  {
    label: 'Notifications',
    href: '/notifications',
    icon: BellOutlined
  },
  {
    label: 'Resources',
    href: '/resources',
    icon: SettingOutlined
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: UserOutlined
  }
]

export const ROUTE_RULES: RouteRule[] = [
  // Add route rules here if you need role-based restrictions
  // Example:
  // {
  //   pattern: /^\/achievements(\/.*)?$/,
  //   allowedRoles: [Role.ADMIN]
  // }
]

const isRoleAllowed = (allowedRoles: Role[] | undefined, userRole: Role | null | undefined) => {
  if (!allowedRoles || allowedRoles.length === 0) return true
  if (!userRole) return false
  return allowedRoles.includes(userRole)
}

export const filterNavItemsByRole = (
  items: NavItem[],
  userRole: Role | null | undefined
): NavItem[] => {
  return items.reduce<NavItem[]>((acc, item) => {
    const filteredChildren = item.children
      ? filterNavItemsByRole(item.children, userRole)
      : undefined
    const canViewSelf = isRoleAllowed(item.roles, userRole)
    const canViewChildren = filteredChildren && filteredChildren.length > 0

    if (canViewSelf || canViewChildren) {
      acc.push({
        ...item,
        children: filteredChildren
      })
    }

    return acc
  }, [])
}

export const getRouteRuleForPath = (path: string): RouteRule | undefined => {
  return ROUTE_RULES.find((rule) => rule.pattern.test(path))
}

export const canRoleAccessPath = (path: string, role: Role | null | undefined) => {
  const rule = getRouteRuleForPath(path)
  if (!rule) return true
  if (!role) return false
  return rule.allowedRoles.includes(role)
}
