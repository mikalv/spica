import {Return, Just, Nothing, Maybe} from './maybe';

describe('Unit: lib/maybe', () => {
  function throwError(): any {
    throw new Error();
  }

  describe('Maybe', () => {
    it('Maybe object', () => {
      assert(Maybe.Return === Return);
      assert(Maybe.Just === Just);
      assert(Maybe.Nothing === Nothing);
    });

    it('Maybe type', () => {
      const just: Maybe<number> = Just(0);
      const nothing: Maybe<number> = Nothing;
      const maybe: Maybe<number> = Just(0).bind<number>(n => Just(n) || Nothing);
    });

    it('Just type', () => {
      const just: Just<number> = Just(0);
    });

    it('Just', () => {
      const result = Return(0)
        .bind(n => Just(n + 1))
        .bind(n => Just(n + 1).bind(n => Just(`Just ${n}`)))
        .extract(() => 'Nothing');
      assert(result === 'Just 2');
    });

    it('Just nest', () => {
      const result = Return(Return(0))
        .bind(m => Just(m))
        .bind(m => m.bind(n => Just(n + 1)).bind(n => Just(`Just ${n}`)))
        .extract(() => 'Nothing');
      assert(result === 'Just 1');
    });

    it('Nothing type', () => {
      const nothing: Nothing = Nothing;
    });

    it('Nothing', () => {
      const result = Return(0)
        .bind(n => Just(n + 1))
        .bind(n => Just(`Just ${n}`).bind(_ => Nothing))
        .bind(throwError)
        .extract(() => 'Nothing');
      assert(result === 'Nothing');
    });

    it('Nothing nest', () => {
      const result = Return(Return(0))
        .bind(m => m.bind(n => Nothing).bind(throwError))
        .bind(throwError)
        .extract(() => 'Nothing');
      assert(result === 'Nothing');
    });

    it('Maybe', () => {
      const result = Return(0)
        .bind(n => Just(n) || Nothing || Just(n).bind<number>(n => Just(n) || Nothing))
        .bind(n => Just(n) || Nothing || Just(n).bind<number>(n => Just(n) || Nothing))
        .extract(() => 'Nothing');
      assert(result === 0);
    });

    it('Functor law 1', () => {
      const f = <T>(n: T) => n;
      const x = 0;
      const fa = Return(x).fmap(f);
      const fb = f(Return(x));
      assert(fa.extract() === fb.extract());
    });

    it('Functor law 2', () => {
      const f = (n: number) => n + 2;
      const g = (n: number) => n * 3;
      const x = 1;
      const fa = Return(x).fmap(n => g(f(n)));
      const fb = Return(x).fmap(f).fmap(g);
      assert(fa.extract() === fb.extract());
    });

    it('Monad law 1', () => {
      const f = (n: number) => Just(n + 1);
      const x = 0;
      const ma = Return(x).bind(f);
      const mb = f(x);
      assert(ma.extract() === mb.extract());
    });

    it('Monad law 2', () => {
      const f = (n: number) => Just(n + 1);
      const x = 0;
      const ma = Return(x);
      const mb = ma.bind(Return);
      assert(ma.extract() === mb.extract());
    });

    it('Monad law 3', () => {
      const m1 = Return(1);
      const m2 = Return(2);
      const m3 = Return(4);
      const ma = m1
        .bind(v1 => m2.bind(v2 => Just(v1 + v2)))
        .bind(n => m3.bind(v3 => Just(n + v3)));
      const mb = m1
        .bind(v1 => m2.bind(v2 => m3.bind(v3 =>
          Just(v2 + v3)))
            .bind(n =>
              Just(v1 + n)));
      assert(ma.extract() === mb.extract());
    });

  });

});
