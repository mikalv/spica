import {Monad} from './monad';

export class Either<a, b> extends Monad<b> {
  protected EITHER: Left<a> | Right<b>;
  constructor(thunk: () => Either<a, b>) {
    super(thunk);
  }
  public fmap<c>(f: (b: b) => c): Either<a, c> {
    return this.bind(b => new Right(f(b)));
  }
  public bind(f: (b: b) => Left<a>): Either<a, b>
  public bind<c>(f: (b: b) => Either<a, c>): Either<a, c>
  public bind<c>(f: (b: b) => Either<a, c>): Either<a, c> {
    return new Either<a, c>(() => {
      const m: Either<a, b> = this.evaluate();
      if (m instanceof Left) {
        return m;
      }
      if (m instanceof Right) {
        return f(m.extract());
      }
      if (m instanceof Either) {
        return m.bind(f);
      }
      throw new TypeError(`Spica: Either: Invalid monad value.\n\t${m}`);
    });
  }
  public extract(): b
  public extract<c>(transform: (a: a) => c): b | c
  public extract<c>(left: (a: a) => c, right: (b: b) => c): c
  public extract<c>(left?: (a: a) => c, right?: (b: b) => c): b | c {
    return !right
      ? this.evaluate().extract(left!)
      : this.fmap(right).extract(left!);
  }
}
export namespace Either {
  export declare function fmap<e, a, b>(m: Either<e, a>, f: (a: a) => b): Either<e, b>
  export declare function fmap<e, a>(m: Either<e, a>): <b>(f: (a: a) => b) => Either<e, b>
  export function pure<b>(b: b): Right<b> {
    return new Right(b);
  }
  export declare function ap<e, a, b>(ff: Either<e, (a: a) => b>, fa: Either<e, a>): Either<e, b>
  export declare function ap<e, a, b>(ff: Either<e, (a: a) => b>): (fa: Either<e, a>) => Either<e, b>
  export const Return = pure;
  export declare function bind<e, a, b>(m: Either<e, a>, f: (a: a) => Either<e, b>): Either<e, b>
  export declare function bind<e, a>(m: Either<e, a>): <b>(f: (a: a) => Either<e, b>) => Either<e, b>
}

export class Left<a> extends Either<a, any> {
  protected EITHER: Left<a>;
  protected LEFT: a;
  constructor(private a: a) {
    super(throwCallError);
  }
  public bind(_: (b: any) => Left<a>): Left<a>
  public bind<c>(_: (b: any) => Either<a, c>): Either<a, c>
  public bind<c>(_: (b: any) => Either<a, c>): Either<a, c> {
    return <Either<a, c>>this;
  }
  public extract(): any
  public extract<c>(transform: (a: a) => c): c
  public extract<c>(left: (a: a) => c, right: (b: void) => c): c
  public extract<c>(left?: (a: a) => c): c {
    if (!left) throw this.a;
    return left(this.a);
  }
}

export class Right<b> extends Either<any, b> {
  protected EITHER: Right<b>;
  protected RIGHT: b;
  constructor(private b: b) {
    super(throwCallError);
  }
  public bind<c>(f: (b: b) => Right<c>): Right<c>
  public bind<a, c>(f: (b: b) => Either<a, c>): Either<a, c>
  public bind<a, c>(f: (b: b) => Either<a, c>): Either<a, c> {
    return new Either<a, c>(() => f(this.extract()));
  }
  public extract(): b
  public extract<c>(transform: (a: void) => c): b
  public extract<c>(left: (a: void) => c, right: (b: b) => c): c
  public extract<c>(_?: (a: void) => c, right?: (b: b) => c): b | c {
    return !right
      ? this.b
      : right(this.b);
  }
}

function throwCallError(): never {
  throw new Error(`Spica: Either: Invalid thunk call.`);
}
