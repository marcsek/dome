export class Noise {
  private static readonly PERLIN_YWRAPB = 4;
  private static readonly PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
  private static readonly PERLIN_ZWRAPB = 8;
  private static readonly PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB;
  private static readonly PERLIN_SIZE = 4095;

  private static perlin_octaves = 4;
  private static perlin_amp_falloff = 0.5;

  private static perlin: number[] | undefined;

  private static scaled_cosine(i: number) {
    return 0.5 * (1.0 - Math.cos(i * Math.PI));
  }

  static perlinNoise(x: number, y = 0, z = 0) {
    if (!this.perlin) {
      this.perlin = new Array(this.PERLIN_SIZE + 1);
      for (let i = 0; i < this.PERLIN_SIZE + 1; i++) {
        this.perlin[i] = Math.random();
      }
    }

    if (x < 0) x = -x;
    if (y < 0) y = -y;
    if (z < 0) z = -z;

    let xi = Math.floor(x),
      yi = Math.floor(y),
      zi = Math.floor(z);
    let xf = x - xi;
    let yf = y - yi;
    let zf = z - zi;
    let rxf, ryf;

    let r = 0;
    let ampl = 0.5;

    let n1, n2, n3;

    for (let o = 0; o < this.perlin_octaves; o++) {
      let off = xi + (yi << this.PERLIN_YWRAPB) + (zi << this.PERLIN_ZWRAPB);

      rxf = this.scaled_cosine(xf);
      ryf = this.scaled_cosine(yf);

      n1 = this.perlin[off & this.PERLIN_SIZE];
      n1 += rxf * (this.perlin[(off + 1) & this.PERLIN_SIZE] - n1);
      n2 = this.perlin[(off + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
      n2 += rxf * (this.perlin[(off + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n2);
      n1 += ryf * (n2 - n1);

      off += this.PERLIN_ZWRAP;
      n2 = this.perlin[off & this.PERLIN_SIZE];
      n2 += rxf * (this.perlin[(off + 1) & this.PERLIN_SIZE] - n2);
      n3 = this.perlin[(off + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
      n3 += rxf * (this.perlin[(off + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n3);
      n2 += ryf * (n3 - n2);

      n1 += this.scaled_cosine(zf) * (n2 - n1);

      r += n1 * ampl;
      ampl *= this.perlin_amp_falloff;
      xi <<= 1;
      xf *= 2;
      yi <<= 1;
      yf *= 2;
      zi <<= 1;
      zf *= 2;

      if (xf >= 1.0) {
        xi++;
        xf--;
      }
      if (yf >= 1.0) {
        yi++;
        yf--;
      }
      if (zf >= 1.0) {
        zi++;
        zf--;
      }
    }
    return r;
  }

  static noiseDetail(lod: number, falloff: number) {
    if (lod > 0) {
      this.perlin_octaves = lod;
    }
    if (falloff > 0) {
      this.perlin_amp_falloff = falloff;
    }
  }

  static resetPerlin() {
    this.perlin = undefined;
  }
}
