import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { checkUser, selectUserIsLoading } from '../../services/slices/auth';
import { getIngredients } from '../../services/slices/ingredients';
import { useDispatch, useSelector } from '../../services/store';
import { ProtectedRoute } from '../protected-route';
import { Preloader } from '../ui/preloader';
import { useLocation } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const isUserLoading = useSelector(selectUserIsLoading);

  useEffect(() => {
    dispatch(checkUser());
    dispatch(getIngredients());
  }, []);

  const handleModalClose = () => {
    navigate(-1);
  };

  if (isUserLoading) {
    return <Preloader />;
  }

  // Получаем состояние background
  const background = location.state?.background;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/login' element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/login' element={<Login />} />
        </Route>
        <Route path='/register' element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/register' element={<Register />} />
        </Route>
        <Route path='/forgot-password' element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Route>
        <Route path='/reset-password' element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        <Route path='/feed' element={<Feed />} />
        <Route path='/profile' element={<ProtectedRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
        </Route>
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
