import React from 'react'
import { useLocation } from 'react-router-dom'

import { routes } from '../routes/index'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

interface Breadcrumb {
  pathname: string
  name: string
  active: boolean
}

const AppBreadcrumb: React.FC = () => {
  const currentLocation = useLocation().pathname

  // Hàm getRouteName nhận vào pathname và danh sách routes, trả về tên route tương ứng
  const getRouteName = (pathname: string, routes: { path: string, name?: string }[]): string | false => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute && currentRoute.name ? currentRoute.name : false
  }

  // Hàm getBreadcrumbs trả về danh sách các breadcrumb
  const getBreadcrumbs = (location: string): Breadcrumb[] => {
    const breadcrumbs: Breadcrumb[] = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      if (routeName) {
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length,
        })
      }
      return currentPathname
    }, '')
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
          key={index}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
