(function () {
  async function fetchAds() {
    try {
      const res = await fetch('/api/ads/public');
      const data = await res.json();
      if (!data.ok) return [];
      return data.ads || [];
    } catch (err) {
      console.error('Ads error', err);
      return [];
    }
  }

  function createAdElement(ad) {
    const wrapper = document.createElement('div');
    wrapper.className = 'ad-unit';

    const imgPart = ad.imageUrl
      ? '<div class="ad-img-wrap"><img src="' + ad.imageUrl + '" alt=""></div>'
      : '';

    wrapper.innerHTML = 
      
      <div class="ad-text">
        <div class="ad-title"></div>
        <div class="ad-advertiser"></div>
        <a href="" target="_blank" class="ad-link">Learn more</a>
      </div>
    ;
    return wrapper;
  }

  function distributeAds(ads) {
    const slots = document.querySelectorAll('[data-ad-slot]');
    if (!slots.length || !ads.length) return;

    let index = 0;
    slots.forEach((slot) => {
      const slotPos = slot.getAttribute('data-ad-slot') || 'sidebar';
      const candidates = ads.filter(a => (a.position || 'sidebar') === slotPos);
      let ad = null;

      if (candidates.length) {
        ad = candidates[index % candidates.length];
      } else {
        ad = ads[index % ads.length];
      }

      index++;
      if (ad) {
        const el = createAdElement(ad);
        slot.innerHTML = '';
        slot.appendChild(el);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const ads = await fetchAds();
    distributeAds(ads);
  });
})();
