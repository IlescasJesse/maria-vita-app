/**
 * Smooth scroll utility with easing
 */

export const smoothScrollTo = (targetId: string, duration: number = 600) => {
  const target = document.getElementById(targetId.replace('#', ''));
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  // Easing function: ease-out cubic (smooth deceleration)
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeOutCubic(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

export const handleSmoothScroll = (
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string
) => {
  if (href.startsWith('#')) {
    event.preventDefault();
    smoothScrollTo(href, 600);
  }
};
