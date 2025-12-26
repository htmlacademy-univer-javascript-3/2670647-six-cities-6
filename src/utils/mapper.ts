export type ApiHost = {
  name?: string;
  login?: string;
  avatar_url?: string;
  avatarUrl?: string;
  avatar?: string;
  is_pro?: boolean;
  isPro?: boolean;
};

export type ApiLocation = {
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  zoom?: number;
  location?: { latitude?: number; longitude?: number; zoom?: number };
};

export type ApiCity = {
  name?: string;
  location?: ApiLocation;
  lat?: number;
  lng?: number;
  zoom?: number;
};

export type ApiOffer = {
  id?: string | number;
  _id?: string | number;
  offerId?: string | number;
  title?: string;
  price?: number;
  cost?: number;
  rating?: number;
  type?: string;
  room_type?: string;
  preview_image?: string;
  previewImage?: string;
  preview?: string;
  image?: string;
  images?: string[];
  is_premium?: boolean;
  isPremium?: boolean;
  premium?: boolean;
  is_favorite?: boolean;
  isFavorite?: boolean;
  favorite?: boolean;
  bedrooms?: number;
  max_adults?: number;
  maxAdults?: number;
  maxAdultsCount?: number;
  description?: string;
  goods?: string[];
  features?: string[];
  host?: ApiHost;
  user?: ApiHost;
  city?: ApiCity;
  coords?: ApiLocation;
  location?: ApiLocation;
  [key: string]: unknown;
};

export type Offer = {
  id: string;
  title: string;
  type: string;
  price: number;
  rating: number;
  previewImage?: string;
  image?: string;
  isPremium?: boolean;
  isFavorite?: boolean;
  bedrooms?: number;
  maxAdults?: number;
  description?: string;
  goods?: string[];
  host?: { name: string; avatarUrl?: string; isPro?: boolean };
  city?: {
    name: string;
    location: { latitude: number; longitude: number; zoom?: number };
  };
  location?: { latitude: number; longitude: number; zoom?: number };
  images?: string[];
};

const toNumber = (v: unknown, fallback = 0): number => {
  if (typeof v === 'number') {
    return v;
  }
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isNaN(n) ? fallback : n;
  }
  return fallback;
};

const toString = (v: unknown, fallback = ''): string => {
  if (typeof v === 'string') {
    return v;
  }
  if (typeof v === 'number') {
    return String(v);
  }
  return fallback;
};

export const adaptOffer = (o: ApiOffer): Offer => {
  const id = toString(o.id ?? o._id ?? o.offerId, '');
  const title = toString(o.title, '');
  const price = toNumber(o.price ?? o.cost, 0);
  const rating = toNumber(o.rating, 0);
  const type = toString(o.type ?? o.room_type, 'apartment');

  const previewImage = toString(
    o.preview_image ?? o.previewImage ?? o.preview,
    ''
  );

  let image = '';
  if (typeof o.image === 'string' && o.image) {
    image = o.image;
  } else if (
    Array.isArray(o.images) &&
    o.images.length > 0 &&
    typeof o.images[0] === 'string'
  ) {
    image = o.images[0];
  }

  const isPremium = Boolean(o.is_premium ?? o.isPremium ?? o.premium ?? false);
  const isFavorite = Boolean(
    o.is_favorite ?? o.isFavorite ?? o.favorite ?? false
  );
  const bedrooms = toNumber(o.bedrooms, 0) || undefined;
  const maxAdults =
    toNumber(o.max_adults ?? o.maxAdults ?? o.maxAdultsCount, 0) || undefined;
  const description = toString(o.description || '', '') || undefined;

  let goods: string[] | undefined;
  if (Array.isArray(o.goods)) {
    goods = o.goods.filter((g): g is string => typeof g === 'string');
  } else if (Array.isArray(o.features)) {
    goods = o.features.filter((g): g is string => typeof g === 'string');
  } else {
    goods = undefined;
  }

  const hostSrc = o.host ?? o.user;
  const host = hostSrc
    ? {
        name: toString(hostSrc.name ?? hostSrc.login, ''),
        avatarUrl:
          toString(
            hostSrc.avatar_url ?? hostSrc.avatarUrl ?? hostSrc.avatar,
            ''
          ) || undefined,
        isPro: Boolean(hostSrc.is_pro ?? hostSrc.isPro ?? false),
      }
    : undefined;

  const citySrc = o.city;
  const city = citySrc
    ? {
        name: toString(citySrc.name, ''),
        location: {
          latitude: toNumber(
            citySrc.location?.latitude ?? citySrc.lat ?? citySrc.location?.lat,
            0
          ),
          longitude: toNumber(
            citySrc.location?.longitude ?? citySrc.lng ?? citySrc.location?.lng,
            0
          ),
          zoom: toNumber(citySrc.location?.zoom ?? citySrc.zoom, 10),
        },
      }
    : undefined;

  const locSrc = o.location ?? o.coords;
  const location = locSrc
    ? {
        latitude: toNumber(
          locSrc.latitude ?? locSrc.lat ?? locSrc.location?.latitude,
          0
        ),
        longitude: toNumber(
          locSrc.longitude ?? locSrc.lng ?? locSrc.location?.longitude,
          0
        ),
        zoom: toNumber(locSrc.zoom ?? locSrc.location?.zoom, 10),
      }
    : undefined;

  const images = Array.isArray(o.images)
    ? o.images.filter((i): i is string => typeof i === 'string')
    : undefined;

  return {
    id,
    title,
    type,
    price,
    rating,
    previewImage: previewImage || undefined,
    image: image || undefined,
    isPremium,
    isFavorite,
    bedrooms,
    maxAdults,
    description,
    goods,
    host,
    city,
    location,
    images,
  };
};

export default adaptOffer;
