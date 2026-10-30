// 等轴测绘制工具：把机组建模成三面着色的立方体/圆柱
const ISO = { c: Math.cos(Math.PI/6), s: Math.sin(Math.PI/6), ox: 420, oy: 120, k: 1 };
function iso(x, y, z){            // 世界坐标 → 屏幕坐标（y 向里，z 向上）
  return [ ISO.ox + (x - y) * ISO.c * ISO.k,
           ISO.oy + (x + y) * ISO.s * ISO.k - z * ISO.k ];
}
function poly(pts, fill, stroke, sw){
  return `<polygon points="${pts.map(p=>p.map(n=>n.toFixed(1)).join(',')).join(' ')}"
    fill="${fill}" ${stroke?`stroke="${stroke}" stroke-width="${sw||1}"`:''} />`;
}
// 立方体：底面左下角 (x,y,z)，尺寸 w(向 y+)、d(向 x+)、h(向上)
function box(x, y, z, w, d, h, top, left, right, edge){
  const A = iso(x,   y,   z+h), B = iso(x+d, y,   z+h), C = iso(x+d, y+w, z+h), D = iso(x,   y+w, z+h);
  const E = iso(x+d, y,   z),   F = iso(x+d, y+w, z),   G = iso(x,   y+w, z);
  return poly([A,B,C,D], top, edge) + poly([B,C,F,E], right, edge) + poly([D,C,F,G], left, edge);
}
// 圆柱（轴向沿 x）
function cylX(x, y, z, r, len, face, body, edge){
  const p1 = iso(x, y, z), p2 = iso(x+len, y, z);
  const rx = r * ISO.c * 1.55, ry = r * ISO.s * 1.55;
  return `<g>
    <ellipse cx="${p1[0]}" cy="${p1[1]}" rx="${rx}" ry="${ry}" fill="${body}" stroke="${edge}" stroke-width="1"/>
    <rect x="${p1[0]}" y="${p1[1]-ry}" width="${p2[0]-p1[0]}" height="${ry*2}" fill="${body}" opacity=".96"/>
    <ellipse cx="${p2[0]}" cy="${p2[1]}" rx="${rx}" ry="${ry}" fill="${face}" stroke="${edge}" stroke-width="1"/>
  </g>`;
}
// 竖直圆柱（轴向 z）
function cylZ(x, y, z, r, h, face, body, edge){
  const b = iso(x, y, z), t = iso(x, y, z+h);
  const rx = r * ISO.c * 1.6, ry = r * ISO.s * 1.6;
  return `<g>
    <path d="M${b[0]-rx} ${b[1]} v${(t[1]-b[1])} a${rx} ${ry} 0 0 0 ${rx*2} 0 v${(b[1]-t[1])} z"
      fill="${body}" stroke="${edge}" stroke-width="1"/>
    <ellipse cx="${t[0]}" cy="${t[1]}" rx="${rx}" ry="${ry}" fill="${face}" stroke="${edge}" stroke-width="1"/>
  </g>`;
}
