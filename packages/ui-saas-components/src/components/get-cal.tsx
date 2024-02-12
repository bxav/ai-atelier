'use client';

import { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

type LayoutType = 'month_view' | 'week_view' | 'column_view';

type GetCalProps = {
  calLink?: string;
  buttonPosition?: "bottom-left" | "bottom-right";
  brandColor?: string;
  hideEventTypeDetails?: boolean;
  layout?: LayoutType;
};

const useCalApi = (
  calLink: string,
  buttonPosition: "bottom-left" | "bottom-right",
  brandColor: string,
  hideEventTypeDetails: boolean,
  layout: LayoutType
) => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal('floatingButton', { calLink, buttonPosition });
      cal('ui', {
        styles: { branding: { brandColor } },
        hideEventTypeDetails,
        layout,
      });
    })();
  }, [calLink, brandColor, hideEventTypeDetails, layout]);
};

export const GetCal = ({
  calLink = 'bxav1/15min',
  buttonPosition = "bottom-right",
  brandColor = '#000000',
  hideEventTypeDetails = false,
  layout = 'month_view',
}: GetCalProps) => {
  useCalApi(calLink, buttonPosition, brandColor, hideEventTypeDetails, layout);

  return null;
};
