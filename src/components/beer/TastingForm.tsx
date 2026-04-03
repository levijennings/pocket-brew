import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Slider,
  TextInput,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { Camera } from 'lucide-react-native'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { StarRating } from '../ui/StarRating'
import { FlavorTag } from './FlavorTag'

interface TastingFormProps {
  onSubmit?: (data: TastingFormData) => void
  style?: ViewStyle
}

export interface TastingFormData {
  beerId: string
  overallRating: number
  aroma: number
  appearance: number
  taste: number
  mouthfeel: number
  flavorNotes: string[]
  servingType: 'draft' | 'bottle' | 'can' | 'cask'
  notes: string
  photoUrl?: string
}

const FLAVOR_OPTIONS = [
  'Hoppy',
  'Citrus',
  'Malty',
  'Fruity',
  'Roasty',
  'Spicy',
  'Floral',
  'Earthy',
  'Sweet',
  'Bitter',
  'Smooth',
  'Crisp',
]

const SERVING_TYPES: Array<'draft' | 'bottle' | 'can' | 'cask'> = [
  'draft',
  'bottle',
  'can',
  'cask',
]

export function TastingForm({ onSubmit, style }: TastingFormProps) {
  const [beerId, setBeerId] = useState('')
  const [overallRating, setOverallRating] = useState(0)
  const [aroma, setAroma] = useState(3)
  const [appearance, setAppearance] = useState(3)
  const [taste, setTaste] = useState(3)
  const [mouthfeel, setMouthfeel] = useState(3)
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [servingType, setServingType] = useState<'draft' | 'bottle' | 'can' | 'cask'>('draft')
  const [notes, setNotes] = useState('')

  const handleFlavorToggle = (flavor: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor)
        ? prev.filter((f) => f !== flavor)
        : [...prev, flavor]
    )
  }

  const handleSubmit = () => {
    onSubmit?.({
      beerId,
      overallRating,
      aroma,
      appearance,
      taste,
      mouthfeel,
      flavorNotes: selectedFlavors,
      servingType,
      notes,
    })
  }

  return (
    <ScrollView
      style={style}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Beer Selection */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Beer Details</Text>
        <Input
          label="Beer Name or Brewery"
          placeholder="Search beer..."
          value={beerId}
          onChangeText={setBeerId}
          style={styles.input}
        />
      </Card>

      {/* Overall Rating */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Rating</Text>
        <View style={styles.ratingContainer}>
          <StarRating
            rating={overallRating}
            size={32}
            interactive
            onRatingChange={setOverallRating}
          />
          {overallRating > 0 && (
            <Text style={styles.ratingValue}>{overallRating}/5</Text>
          )}
        </View>
      </Card>

      {/* Serving Type */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Serving Type</Text>
        <View style={styles.servingTypeContainer}>
          {SERVING_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setServingType(type)}
              style={[
                styles.servingTypeButton,
                servingType === type && styles.servingTypeButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.servingTypeText,
                  servingType === type && styles.servingTypeTextSelected,
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Attribute Ratings */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Attributes</Text>

        <View style={styles.attributeGroup}>
          <Text style={styles.attributeLabel}>Aroma: {aroma}/5</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={aroma}
            onValueChange={setAroma}
            minimumTrackTintColor={colors.brand[500]}
            maximumTrackTintColor={colors.dark.border}
          />
        </View>

        <View style={styles.attributeGroup}>
          <Text style={styles.attributeLabel}>Appearance: {appearance}/5</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={appearance}
            onValueChange={setAppearance}
            minimumTrackTintColor={colors.brand[500]}
            maximumTrackTintColor={colors.dark.border}
          />
        </View>

        <View style={styles.attributeGroup}>
          <Text style={styles.attributeLabel}>Taste: {taste}/5</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={taste}
            onValueChange={setTaste}
            minimumTrackTintColor={colors.brand[500]}
            maximumTrackTintColor={colors.dark.border}
          />
        </View>

        <View style={[styles.attributeGroup, styles.attributeGroupLast]}>
          <Text style={styles.attributeLabel}>Mouthfeel: {mouthfeel}/5</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={mouthfeel}
            onValueChange={setMouthfeel}
            minimumTrackTintColor={colors.brand[500]}
            maximumTrackTintColor={colors.dark.border}
          />
        </View>
      </Card>

      {/* Flavor Notes */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Flavor Notes</Text>
        <View style={styles.flavorContainer}>
          {FLAVOR_OPTIONS.map((flavor) => (
            <FlavorTag
              key={flavor}
              label={flavor}
              selected={selectedFlavors.includes(flavor)}
              onPress={() => handleFlavorToggle(flavor)}
            />
          ))}
        </View>
      </Card>

      {/* Notes */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Tasting Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add your thoughts about this beer..."
          placeholderTextColor={colors.dark.textMuted}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
      </Card>

      {/* Photo & Submit */}
      <Card style={styles.section}>
        <TouchableOpacity style={styles.photoButton}>
          <Camera size={24} color={colors.brand[500]} />
          <Text style={styles.photoButtonText}>Add Photo</Text>
        </TouchableOpacity>

        <Button
          title="Save Tasting Note"
          onPress={handleSubmit}
          variant="primary"
          size="lg"
          style={styles.submitButton}
        />
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.dark.text,
    fontFamily: typography.fontFamily.sans,
  },
  input: {
    marginBottom: 0,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.brand[500],
    fontFamily: typography.fontFamily.sans,
  },
  servingTypeContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  servingTypeButton: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.dark.surface,
    borderWidth: 1,
    borderColor: colors.dark.border,
    alignItems: 'center',
  },
  servingTypeButtonSelected: {
    backgroundColor: colors.brand[500],
    borderColor: colors.brand[500],
  },
  servingTypeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.dark.text,
    fontFamily: typography.fontFamily.sans,
  },
  servingTypeTextSelected: {
    color: '#FFFFFF',
  },
  attributeGroup: {
    gap: 8,
  },
  attributeGroupLast: {
    marginBottom: 0,
  },
  attributeLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.dark.text,
    fontFamily: typography.fontFamily.sans,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  flavorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  notesInput: {
    backgroundColor: colors.dark.surfaceHover,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: typography.fontSize.sm,
    color: colors.dark.text,
    fontFamily: typography.fontFamily.sans,
    textAlignVertical: 'top',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderStyle: 'dashed',
  },
  photoButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.brand[500],
    fontFamily: typography.fontFamily.sans,
  },
  submitButton: {
    marginTop: 12,
  },
})
