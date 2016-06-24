import {Return, Just, Nothing, Maybe} from './maybe';
import {curry} from '../curry';

describe('Unit: lib/maybe', () => {
  function throwError(msg: string): any {
    throw new Error(msg);
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

    it('ap 1', () => {
      assert.strictEqual(
        Maybe.ap(
          Maybe.pure(curry((a: number) => a)))
          (Just(1))
          .extract(),
        1);
      assert.strictEqual(
        Maybe.ap(
          Maybe.pure(curry(throwError)))
          (Nothing)
          .extract(() => 0),
        0);
    });

    it('ap 2', () => {
      assert.strictEqual(
        Maybe.ap(Maybe.ap(
          Maybe.pure(curry((a: number, b: number) => a + b)))
          (Just(1)))
          (Just(2))
          .extract(),
        3);
    });

    it('ap 3', () => {
      assert.strictEqual(
        Maybe.ap(Maybe.ap(Maybe.ap(
          Maybe.pure(curry((a: number, b: number, c: number) => a + b + c)))
          (Just(1)))
          (Just(2)))
          (Just(3))
          .extract(),
        6);
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

    it('mplus', () => {
      assert(Maybe.mplus(Just(0), Just(1)).extract() === 0);
      assert(Maybe.mplus(Just(0), Nothing).extract() === 0);
      assert(Maybe.mplus(Nothing, Just(0)).extract() === 0);
      assert(Maybe.mplus(Nothing, Nothing).extract(() => 0) === 0);
      assert(Maybe.mplus(Just(0).fmap(n => n - 1), Just(1)).extract() === -1);
    });

    it('MonadPlus law 1', () => {
      const f = (n: number) => Just(n + 1);
      const x = 0;
      const ma = Maybe.mzero;
      const mb = Maybe.mzero.bind(f);
      assert(ma.extract(() => -1) === mb.extract(() => -1));
    });

    it('Call-by-need and Memoize', () => {
      let n = NaN;
      const m1 = Return(NaN)
        .bind(_ => Just(++n));
      const m2 = m1
        .bind(_ => Just(++n));
      n = 0;
      assert(m2.extract() === 2);
      assert(m2.extract() === 2);
      assert(m2.extract() === 2);
      assert(m1.extract() === 1);
      assert(m1.extract() === 1);
      assert(m1.extract() === 1);
    });

  });

});
