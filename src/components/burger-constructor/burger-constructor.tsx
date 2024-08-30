import { BurgerConstructorUI } from '@ui';
import { RequestStatus, TConstructorIngredient } from '@utils-types';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthorized } from '../../services/slices/auth';
import {
  resetConstructor,
  selectBurger
} from '../../services/slices/burger-constructor';
import {
  orderBurger,
  resetOrder,
  selectBurgerOrder,
  selectBurgerOrderStatus
} from '../../services/slices/burger-order';
import { useDispatch, useSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuth = useSelector(selectIsAuthorized);
  const constructorItems = useSelector(selectBurger);
  const orderRequest =
    useSelector(selectBurgerOrderStatus) === RequestStatus.Loading;

  const orderModalData = useSelector(selectBurgerOrder);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuth) return navigate('/login', { replace: true });

    const data: string[] = [];

    constructorItems.ingredients.forEach((i) => data.push(i._id));
    if (constructorItems.bun) {
      data.unshift(constructorItems.bun._id);
      data.push(constructorItems.bun._id);
    }

    dispatch(orderBurger(data));
    dispatch(resetConstructor());
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
