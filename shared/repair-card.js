function createRepairCard(repair, isRecommended = false) {
  const link = repair.link ? repair.link : '#';
  return `
    <div class="repair-card ${isRecommended ? 'recommended' : ''}">
      <h4>${repair.label}</h4>
      ${isRecommended ? '<span class="badge-rec">RECOMMENDED</span>' : ''}
      
      <div class="detail-row mt-3">
        <span>Est. Cost:</span>
        <strong class="cost">$${repair.cost}</strong>
      </div>
      <div class="detail-row">
        <span>Location:</span>
        <strong>London/Woodstock, ON</strong>
      </div>
      
      <a href="${link}" class="btn ${repair.affiliate ? 'btn-outline-success' : 'btn-custom-primary'}">
        ${repair.affiliate ? 'Buy Now (Amazon)' : 'Book Service'}
      </a>
    </div>
  `;
}
