import {
  Supervisor,
  Observation,
  Sequence,
  Cancellation,
  Maybe, Just, Nothing,
  Either, Left, Right,
  curry,
  flip,
  List, Nil,
  HList, HNil,
  DataMap, AttrMap,
  Cache,
  tick,
  uuid,
  sqid,
  assign,
  clone,
  extend,
  concat,
  sort
} from '../../index';

describe('Interface: Package', function () {
  describe('Supervisor', function () {
    it('Supervisor', function () {
      assert(typeof Supervisor === 'function');
    });

  });

  describe('Observation', function () {
    it('Observation', function () {
      assert(typeof Observation === 'function');
    });

  });

  describe('Sequence', function () {
    it('Sequence', function () {
      assert(typeof Sequence === 'function');
    });

  });

  describe('Cancellation', function () {
    it('Cancellation', function () {
      assert(typeof Cancellation === 'function');
    });

  });

  describe('Maybe', function () {
    it('Maybe', function () {
      assert(typeof Maybe === 'object');
    });

    it('Return', function () {
      assert(typeof Maybe.Return === 'function');
    });

    it('Just', function () {
      assert(typeof Just === 'function');
    });

    it('Nothing', function () {
      assert(typeof Nothing === 'object');
    });

  });

  describe('Either', function () {
    it('Either', function () {
      assert(typeof Either === 'object');
    });

    it('Return', function () {
      assert(typeof Either.Return === 'function');
    });

    it('Left', function () {
      assert(typeof Left === 'function');
    });

    it('Right', function () {
      assert(typeof Right === 'function');
    });

  });

  describe('curry', function () {
    it('curry', function () {
      assert(typeof curry === 'function');
    });

    it('flip', function () {
      assert(typeof flip === 'function');
    });

  });

  describe('List', function () {
    it('List', function () {
      <List<number, Nil>>new Nil().push(0);
    });

    it('Nil', function () {
      assert(typeof Nil === 'function');
    });

  });

  describe('HList', function () {
    it('HList', function () {
      <HList<number, HNil>>new HNil().push(0);
    });

    it('HNil', function () {
      assert(typeof HNil === 'function');
    });

  });

  describe('Collection', function () {
    it('DataMap', function () {
      assert(typeof DataMap === 'function');
    });

    it('AttrMap', function () {
      assert(typeof AttrMap === 'function');
    });

  });

  describe('Cache', function () {
    it('Cache', function () {
      assert(typeof Cache === 'function');
    });

  });

  describe('tick', function () {
    it('tick', function () {
      assert(typeof tick === 'function');
    });

  });

  describe('utils', function () {
    it('uuid', function () {
      assert(typeof uuid === 'function');
    });

    it('sqid', function () {
      assert(typeof sqid === 'function');
    });

    it('assign', function () {
      assert(typeof assign === 'function');
    });

    it('clone', function () {
      assert(typeof clone === 'function');
    });

    it('extend', function () {
      assert(typeof extend === 'function');
    });

    it('concat', function () {
      assert(typeof concat === 'function');
    });

    it('sort', function () {
      assert(typeof sort === 'function');
    });

  });

});
