export async function getTwaTemplate(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;
  if (!subdomain) {
    return null;
  }

  // get app from db and cache it then get template from app

  return "basic";
}

export async function getTwaFromDomain(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;
  if (!subdomain) {
    return null;
  }

  // get app from db and cache it then return the app

  return { name: subdomain, template: "basic" };
}
