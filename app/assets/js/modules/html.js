class html {
  static songListElement(p) {
    return `
    <div class="e radius relative undraggable" data-role="song_list_e" data-id="${p.id}">
      <div class="center">
        <div class="thumbnail l radius no_overflow relative" style="background-image: url(${p.thumbnailUrl});">
          <!--<img src="${p.thumbnailUrl}" class="w100" />-->
        </div>
        <div class="details l">
          <div class="title w100 no_overflow text_align_left">${p.title}</div>
          <div class="progress w100 radius no_overflow">
            <div class="bar l radius"></div>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}
