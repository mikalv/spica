import { Sequence } from '../../core';

export default class <a, z> extends Sequence<a, z> {
  public permutations(): Sequence<a[], [Sequence.Iterator<Sequence<a[], any>>, Sequence.Iterator<a[]>]> {
    return Sequence.from([0])
      .bind<a[]>(() => {
        const xs = this.extract();
        return xs.length === 0
          ? Sequence.mempty
          : Sequence.from([xs]);
      })
      .bind(xs =>
        Sequence.mappend(
          Sequence.from([xs]),
          perms<a>(Sequence.from(xs), Sequence.mempty)));
  }
}

function perms<a>(ts: Sequence<a, any>, is: Sequence<a, any>): Sequence<a[], [Sequence.Iterator<Sequence<a[], void>>, Sequence.Iterator<a[]>]> {
  return Sequence.Iterator.when<a, Sequence<a[], [Sequence.Iterator<Sequence<a[], void>>, Sequence.Iterator<a[]>]>>(
    ts.iterate(),
    () => Sequence.mempty,
    tt =>
      new Sequence<Sequence<a[], [Sequence.Iterator<Sequence<a[], void>>, Sequence.Iterator<a[]>]>, void>((_, cons) =>
        Sequence.Iterator.when(
          tt,
          () => cons(),
          tt => {
            const t = Sequence.Thunk.value(tt);
            const ts = Sequence.resume(Sequence.Thunk.iterator(tt)).memoize();
            return cons(
              is.permutations()
                .foldr<a[]>((ys, r) =>
                  interleave(Sequence.from(ys), r)
                , perms(
                  ts,
                  Sequence.mappend(Sequence.from([t]), is))));

            function interleave(
              xs: Sequence<a, any>,
              r: Sequence<a[], any>
            ): Sequence<a[], [Sequence.Iterator<a[]>, Sequence.Iterator<a[]>]> {
              return interleave_(as => as, xs, r)[1];
            }
            function interleave_(
              f: (as: Sequence<a, any>) => Sequence<a, any>,
              ys: Sequence<a, any>,
              r: Sequence<a[], any>
            ): [Sequence<a, [Sequence.Iterator<a>, Sequence.Iterator<a[]>]>, Sequence<a[], [Sequence.Iterator<a[]>, Sequence.Iterator<a[]>]>] {
              return Sequence.Iterator.when<a, [Sequence<a, any>, Sequence<a[], any>]>(
                ys.iterate(),
                () => [ts, r],
                yt => {
                  const y = Sequence.Thunk.value(yt);
                  const [us, zs] = interleave_(
                    as => f(Sequence.mappend(Sequence.from([y]), as)),
                    Sequence.resume(Sequence.Thunk.iterator(yt)),
                    r);
                  return [
                    Sequence.mappend(Sequence.from([y]), us),
                    Sequence.mappend(
                      Sequence.from([f(Sequence.mappend<a>(Sequence.from([t]), Sequence.mappend(Sequence.from([y]), us))).extract()]),
                      zs)
                  ];
                });
            }
          }))
        .bind(xs => xs));
}
