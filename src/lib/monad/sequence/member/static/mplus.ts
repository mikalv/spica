import {Sequence} from '../../core';

export default class <T, S> extends Sequence<T, S> {
  public static mplus = Sequence.mappend;
}