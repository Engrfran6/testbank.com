'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {usePathname} from 'next/navigation';

export function BreadcrumbDemo() {
  const pathname = usePathname();

  // Split the pathname into segments
  const segments = pathname.split('/').filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Map through the segments to dynamically create the breadcrumb items */}
        {segments.map((segment, index) => {
          // Build the href dynamically for each breadcrumb
          const href = '/' + segments.slice(0, index + 1).join('/');
          const name = segment.charAt(0).toUpperCase() + segment.slice(1); // Capitalize the name

          return (
            <BreadcrumbItem key={href}>
              <BreadcrumbLink href={href}>{name}</BreadcrumbLink>
              {/* Add a separator only if it's not the last item */}
              {index < segments.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
