import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createElection, updateElection } from '../../api/electionApi';

const CreateElection = ({ navigation, route }: any) => {
  const { mode = 'create', election } = route.params || {};
  const isEdit = mode === 'edit';

  /* ---------------- FORM STATE ---------------- */
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [candidates, setCandidates] = useState([
    { name: '', party: '', bio: '' },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  /* ---------------- PREFILL (EDIT) ---------------- */
  useEffect(() => {
    if (isEdit && election) {
      setName(election.name);
      setDescription(election.electionInfo.description);
      setStartTime(election.electionInfo.startTime);
      setEndTime(election.electionInfo.endTime);
      setIsActive(election.isActive);
      setCandidates(
        election.candidates.map((c: any) => ({
          name: c.name,
          party: c.party,
          bio: c.bio,
        })),
      );
    }
  }, [isEdit, election]);

  /* ---------------- DIRTY CHECK ---------------- */
  const initialSnapshot = useMemo(() => {
    if (!isEdit || !election) return null;
    return JSON.stringify({
      name: election.name,
      description: election.electionInfo.description,
      startTime: election.electionInfo.startTime,
      endTime: election.electionInfo.endTime,
      isActive: election.isActive,
      candidates: election.candidates.map((c: any) => ({
        name: c.name,
        party: c.party,
        bio: c.bio,
      })),
    });
  }, [isEdit, election]);

  const isDirty = useMemo(() => {
    if (!initialSnapshot) return true;
    return (
      JSON.stringify({
        name,
        description,
        startTime,
        endTime,
        isActive,
        candidates,
      }) !== initialSnapshot
    );
  }, [name, description, startTime, endTime, isActive, candidates]);

  /* ---------------- CANDIDATES ---------------- */
  const addCandidate = () =>
    setCandidates([...candidates, { name: '', party: '', bio: '' }]);

  const updateCandidate = (i: number, field: string, value: string) => {
    const copy = [...candidates];
    copy[i] = { ...copy[i], [field]: value };
    setCandidates(copy);
  };

  const removeCandidate = (i: number) => {
    if (candidates.length === 1) return;
    setCandidates(candidates.filter((_, index) => index !== i));
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Election name required';
    if (!description.trim()) e.description = 'Description required';
    if (!startTime.trim()) e.startTime = 'Start time required';
    if (!endTime.trim()) e.endTime = 'End time required';

    candidates.forEach((c, i) => {
      if (!c.name.trim()) e[`c_name_${i}`] = 'Candidate name required';
      if (!c.party.trim()) e[`c_party_${i}`] = 'Party required';
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        name,
        candidates,
        electionInfo: {
          description,
          startTime,
          endTime,
        },
        isActive,
      };

      if (isEdit) {
        await updateElection(election._id, payload);
      } else {
        await createElection(payload);
      }

      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>
          {isEdit ? 'Edit Election' : 'Create Election'}
        </Text>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Election Name"
          placeholderTextColor="#64748b"
        />
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}

        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          placeholderTextColor="#64748b"
        />
        {errors.description && (
          <Text style={styles.error}>{errors.description}</Text>
        )}

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.half]}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="Start Time"
            placeholderTextColor="#64748b"
          />
          <TextInput
            style={[styles.input, styles.half]}
            value={endTime}
            onChangeText={setEndTime}
            placeholder="End Time"
            placeholderTextColor="#64748b"
          />
        </View>

        {/* Candidates */}
        <Text style={styles.sectionTitle}>Candidates</Text>

        {candidates.map((c, i) => (
          <View key={i} style={styles.candidateCard}>
            <TextInput
              style={styles.input}
              value={c.name}
              onChangeText={v => updateCandidate(i, 'name', v)}
              placeholder="Candidate Name"
              placeholderTextColor="#64748b"
            />
            <TextInput
              style={styles.input}
              value={c.party}
              onChangeText={v => updateCandidate(i, 'party', v)}
              placeholder="Party"
              placeholderTextColor="#64748b"
            />
            <TextInput
              style={styles.input}
              value={c.bio}
              onChangeText={v => updateCandidate(i, 'bio', v)}
              placeholder="Bio"
              placeholderTextColor="#64748b"
            />
            {candidates.length > 1 && (
              <TouchableOpacity onPress={() => removeCandidate(i)}>
                <Text style={styles.removeText}>Remove Candidate</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addCandidate}>
          <Text style={styles.addText}>+ Add Candidate</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            (!isDirty || loading) && styles.disabledBtn,
          ]}
          disabled={!isDirty || loading}
          onPress={handleSubmit}
        >
          {loading ? (
            <ActivityIndicator color="#020617" />
          ) : (
            <Text style={styles.submitText}>
              {isEdit ? 'Save Changes' : 'Create Election'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateElection;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#22c55e',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    color: '#e5e7eb',
    marginBottom: 8,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '48%' },
  sectionTitle: { color: '#38bdf8', fontWeight: '700', marginVertical: 12 },
  candidateCard: {
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  addBtn: {
    borderWidth: 1,
    borderColor: '#22c55e',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  addText: { color: '#22c55e', fontWeight: '700' },
  removeText: { color: '#ef4444', textAlign: 'center', marginTop: 8 },
  submitBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitText: { color: '#020617', fontWeight: '800', fontSize: 16 },
  disabledBtn: { backgroundColor: '#86efac' },
  error: { color: '#ef4444', fontSize: 12, marginBottom: 8 },
});
