const assert = require('assert');

class Quadtree {
  constructor({nw, ne, se, sw} = {}) {
    assert(nw.constructor.name === 'Quadtree' || typeof nw === 'boolean');
    assert(ne.constructor.name === 'Quadtree' || typeof ne === 'boolean');
    assert(se.constructor.name === 'Quadtree' || typeof se === 'boolean');
    assert(sw.constructor.name === 'Quadtree' || typeof sw === 'boolean');

    this.nw = nw;
    this.ne = ne;
    this.se = se;
    this.sw = sw;
  }

  equals(quadtree) {
    const check = direction =>
      this[direction].constructor.name === 'Quadtree'
        ? this[direction].equals(quadtree[direction])
        : this[direction] === quadtree[direction];

    return ['nw', 'ne', 'se', 'sw'].map(check).every(x => x === true);
  }

  toString(str) {
    return this.to2dArray().map(
      subarr => subarr.map(
        el => el ? '* ' : '. '
      ).join('')
    ).join('\n')
  }

  static fromString(str) {
    const arr = str
      .trim()
      .split('\n')
      .map(line => line.trim().split(' ').map(el => (el === '.' ? false : true)));
    return this.from2dArray(arr);
  }

  to2dArray() {
    if (typeof this.nw === 'boolean') {
      return [
        [this.nw, this.ne],
        [this.sw, this.se]
      ]
    }

    const nw = this.nw.to2dArray();
    const ne = this.ne.to2dArray();
    const sw = this.sw.to2dArray();
    const se = this.se.to2dArray();

    let out = [];

    for (let i = 0; i < nw.length; i++) {
      out.push( [...nw[i], ...ne[i]] );
    }

    for (let i = 0; i < sw.length; i++) {
      out.push( [...sw[i], ...se[i]] );
    }

    return out;
  }

  static from2dArray(arr) {
    assert(
      arr.map(subarr => subarr.length).every(e => e === arr.length),
      `2d array is not square`,
    );

    if (arr.length === 1) {
      return arr[0][0];
    }

    const nw = arr
      .slice(0, arr.length / 2)
      .map(subarr => subarr.slice(0, subarr.length / 2));

    const ne = arr
      .slice(0, arr.length / 2)
      .map(subarr => subarr.slice(subarr.length / 2, subarr.length));

    const se = arr
      .slice(arr.length / 2, arr.length)
      .map(subarr => subarr.slice(subarr.length / 2, subarr.length));

    const sw = arr
      .slice(arr.length / 2, arr.length)
      .map(subarr => subarr.slice(0, subarr.length / 2));

    return new Quadtree({
      nw: this.from2dArray(nw),
      ne: this.from2dArray(ne),
      se: this.from2dArray(se),
      sw: this.from2dArray(sw),
    });
  }
}

module.exports = Quadtree;
