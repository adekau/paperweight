import { Applicative, Applicative1, Applicative2, ApplicativeF1 } from './Applicative';
import { Bindable, Bindable1, Bindable2, BindableF1 } from './Bindable';
import { HKTS, HKTS2, HKTSF } from './HKT';

export type Monad<F> = Applicative<F> & Bindable<F>;
export type Monad1<F extends HKTS> = Applicative1<F> & Bindable1<F>;
export type MonadF1<F extends HKTSF> = ApplicativeF1<F> & BindableF1<F>;
export type Monad2<F extends HKTS2> = Applicative2<F> & Bindable2<F>;
