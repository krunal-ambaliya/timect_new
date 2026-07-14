export default function CollectionBanners() {
  return (
    <section className="max-w-[1400px] mx-auto px-8 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="collection-tile" style={{ background: 'linear-gradient(160deg,#1a2a3a,#0a1622)' }}>
          <img src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048470/timect/gold_truton_chronograph.jpg" alt="Gold Truton" />
          <div className="grad"></div>
          <div className="cap serif text-[18px]">GOLD TRUTON</div>
        </div>
        <div className="collection-tile" style={{ background: 'linear-gradient(160deg,#0d3a56,#04141f)' }}>
          <img src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048468/timect/daydate_blue.png" alt="Blue Collection" />
          <div className="grad"></div>
          <div className="cap text-[15px] tracked-sm">BLUE</div>
        </div>
        <div className="collection-tile" style={{ background: 'linear-gradient(160deg,#dedac8,#b7b295)' }}>
          <img src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048481/timect/ladies_gold_tt.png" alt="Ladies Collection" />
          <div className="grad"></div>
          <div className="cap text-[16px] tracked-sm" style={{ color: '#111' }}>LADIES</div>
        </div>

        <div className="collection-tile" style={{ background: 'linear-gradient(160deg,#0a1a33,#020814)' }}>
          <img src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048487/timect/rose_gents_date.png" alt="Rose Gold" />
          <div className="grad"></div>
          <div className="cap text-[16px] tracked-sm">ROSE GOLD</div>
        </div>
        <div className="collection-tile" style={{ background: 'linear-gradient(160deg,#0c0c0c,#000)' }}>
          <img src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048491/timect/rose_ladies.png" alt="Rose Ladies" />
          <div className="grad"></div>
          <div className="cap text-[16px] tracked-sm">ROSE LADIES</div>
        </div>
        <div className="collection-tile" style={{ background: 'linear-gradient(160deg,#2a2a2a,#111)' }}>
          <img src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048480/timect/image_9.png" alt="Special Edition" />
          <div className="grad"></div>
          <div className="cap text-[15px] tracked-sm leading-tight">SPECIAL<br />EDITION</div>
        </div>

      </div>
    </section>
  );
}
