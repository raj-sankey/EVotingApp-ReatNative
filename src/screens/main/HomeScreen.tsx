import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import { getAllElections, deleteElection } from '../../api/electionApi';
import ElectionCard from '../../components/election/ElectionCard';
import { useFocusEffect } from '@react-navigation/native';
import ConfirmModal from '../../components/common/ConfirmModal';
import { logout } from '../../redux/auth/authSlice';

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.auth);
  const isAdmin = role === 'admin';

  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchElections();
    }, []),
  );

  const fetchElections = async () => {
    try {
      const res = await getAllElections();
      setElections(res.data.elections);
    } catch (error) {
      console.log('Election fetch error', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      await deleteElection(deleteId);
      setShowConfirm(false);
      setDeleteId(null);
      fetchElections(); // refresh
    } catch (e) {
      console.log('Delete failed', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Elections</Text>

        <View style={{ flexDirection: 'row' }}>
          {isAdmin && (
            <TouchableOpacity
              style={styles.createBtn}
              onPress={() =>
                navigation.navigate('CreateElection', { mode: 'create' })
              }
            >
              <Text style={styles.createText}>+ Create</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={elections}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('ElectionDetail', {
                electionId: item._id,
              })
            }
          >
            <ElectionCard
              election={item}
              isAdmin={isAdmin}
              onEdit={() =>
                navigation.navigate('CreateElection', {
                  mode: 'edit',
                  election: item,
                })
              }
              onDelete={() => confirmDelete(item._id)}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        visible={showConfirm}
        title="Delete Election"
        message="Are you sure you want to delete this election? This action cannot be undone."
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#22c55e',
  },
  createBtn: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createText: {
    color: '#020617',
    fontWeight: '700',
  },
  loader: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtn: {
    marginLeft: 10,
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#e5e7eb',
    fontWeight: '600',
  },
});
